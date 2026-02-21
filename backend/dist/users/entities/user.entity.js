"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRank = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const daily_entity_1 = require("../../daily/entities/daily.entity");
const swagger_1 = require("@nestjs/swagger");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["TEAM_LEADER"] = "team_leader";
    UserRole["EMPLOYEE"] = "employee";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserRank;
(function (UserRank) {
    UserRank["JUNIOR"] = "junior";
    UserRank["MIDDLE"] = "middle";
    UserRank["SENIOR"] = "senior";
    UserRank["LEAD"] = "lead";
    UserRank["MANAGER"] = "manager";
})(UserRank || (exports.UserRank = UserRank = {}));
let User = class User {
    id;
    username;
    password;
    role;
    rank;
    manager;
    managerId;
    subordinates;
    reports;
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: UserRole }),
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.EMPLOYEE,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: UserRank, required: false }),
    (0, typeorm_1.Column)({
        type: 'simple-enum',
        enum: UserRank,
        default: UserRank.JUNIOR,
    }),
    __metadata("design:type", String)
], User.prototype, "rank", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, (user) => user.subordinates, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'managerId' }),
    __metadata("design:type", User)
], User.prototype, "manager", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User, (user) => user.manager),
    __metadata("design:type", Array)
], User.prototype, "subordinates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => daily_entity_1.Daily, (daily) => daily.user),
    __metadata("design:type", Array)
], User.prototype, "reports", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map