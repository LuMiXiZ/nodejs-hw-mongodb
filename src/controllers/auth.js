import {
    registerUser,
    loginUser,
    logoutUser,
    refreshUsersSession,
    requestResetToken,
    resetPassword,
    createSession,
} from '../services/auth.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

const setupSession = (res, session) => {
    res.cookie('accessToken', session.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + FIFTEEN_MINUTES),
    });
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
};

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);

    const newSession = await createSession(user._id);
    setupSession(res, newSession);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export const loginUserController = async (req, res) => {
    const user = await loginUser(req.body);

    await SessionsCollection.deleteOne({ userId: user._id });

    const newSession = await createSession(user._id);
    setupSession(res, newSession);

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: user,
    });
};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
    const session = await refreshUsersSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
    });
};

export const requestResetEmailController = async (req, res) => {
    await requestResetToken(req.body.email);
    res.json({
        message: 'Reset password email was successfully sent!',
        status: 200,
        data: {},
    });
};

export const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);
    res.json({
        message: 'Password was successfully reset!',
        status: 200,
        data: {},
    });
};
