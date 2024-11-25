"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var User_1 = require("../models/User");
var config_1 = require("../../config");
var bcryptjs_1 = require("bcryptjs");
var express_validator_1 = require("express-validator");
var jsonwebtoken_1 = require("jsonwebtoken");
function generateAccessToken(id) {
    var payload = { userId: id };
    return jsonwebtoken_1["default"].sign(payload, config_1["default"].secret, { expiresIn: "24h" });
}
function generateRefreshToken(id) {
    var payload = { userId: id };
    return jsonwebtoken_1["default"].sign(payload, config_1["default"].secret, { expiresIn: "720h" });
}
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.registation = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var errors, _a, username, birthday, email, password, condidate, salt, hashPassword, user, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        errors = express_validator_1.validationResult(req);
                        if (!errors.isEmpty()) {
                            res.status(400).json({ message: 'Ошибка при регистрации' });
                            return [2 /*return*/];
                        }
                        _a = req.body, username = _a.username, birthday = _a.birthday, email = _a.email, password = _a.password;
                        return [4 /*yield*/, User_1.UserModel.findOne({ email: email })];
                    case 1:
                        condidate = _b.sent();
                        if (condidate) {
                            res.status(400).json({ message: 'Такой пользователь уже существует' });
                            return [2 /*return*/];
                        }
                        salt = bcryptjs_1["default"].genSaltSync(config_1["default"].salt);
                        console.log(salt, password);
                        hashPassword = bcryptjs_1["default"].hashSync(password, salt);
                        user = new User_1.UserModel({ username: username, birthday: birthday, email: email, password: hashPassword });
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent();
                        res.json({ message: "Registration succesfully" });
                        return [2 /*return*/];
                    case 3:
                        e_1 = _b.sent();
                        console.log(e_1);
                        res.status(400).json({ message: 'Registration error' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, email, password, user, validPassword, accessToken, refreshToken, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, email = _a.email, password = _a.password;
                        console.log(email, password);
                        console.log(req.body);
                        return [4 /*yield*/, User_1.UserModel.findOne({ email: email })];
                    case 1:
                        user = _b.sent();
                        console.log(user);
                        if (!user) {
                            res.status(400).json({ message: 'Такой пользователь не найден' });
                            return [2 /*return*/];
                        }
                        validPassword = bcryptjs_1["default"].compareSync(password, user.password);
                        if (!validPassword) {
                            res.status(400).json({ message: 'Введен неверный пороль' });
                            return [2 /*return*/];
                        }
                        accessToken = generateAccessToken(user._id);
                        refreshToken = generateRefreshToken(user.id);
                        res.json({ accessToken: accessToken, refreshToken: refreshToken, username: user.username, birthday: user.birthday, email: user.email });
                        return [2 /*return*/];
                    case 2:
                        e_2 = _b.sent();
                        console.log(e_2);
                        res.status(400).json({ message: 'login error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.verifyToken = function (req, res) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var token, decodedToken;
            return __generator(this, function (_b) {
                try {
                    token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                    console.log(token);
                    if (!token) {
                        res.status(401).json({ message: 'Отсутствует токен авторизации' });
                        return [2 /*return*/];
                    }
                    decodedToken = jsonwebtoken_1["default"].verify(token, config_1["default"].secret);
                    console.log(decodedToken);
                    res.status(200).json({ message: 'ok' });
                }
                catch (error) {
                    res.status(401).json({ message: 'Недействительный токен авторизации' });
                }
                return [2 /*return*/];
            });
        });
    };
    return AuthController;
}());
exports["default"] = AuthController;
