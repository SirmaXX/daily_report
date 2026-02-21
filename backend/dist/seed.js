"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./users/entities/user.entity");
const project_entity_1 = require("./projects/entities/project.entity");
const daily_entity_1 = require("./daily/entities/daily.entity");
const bcrypt = __importStar(require("bcrypt"));
async function seed() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const projectRepo = dataSource.getRepository(project_entity_1.Project);
    const dailyRepo = dataSource.getRepository(daily_entity_1.Daily);
    console.log('Seeding database...');
    await dailyRepo.createQueryBuilder().delete().execute();
    await projectRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('password123', salt);
    const admin = await userRepo.save({
        username: 'admin',
        password,
        role: user_entity_1.UserRole.ADMIN,
        rank: user_entity_1.UserRank.MANAGER,
    });
    const teamLeader1 = await userRepo.save({
        username: 'team_leader_ahmet',
        password,
        role: user_entity_1.UserRole.TEAM_LEADER,
        rank: user_entity_1.UserRank.LEAD,
        managerId: admin.id,
    });
    const teamLeader2 = await userRepo.save({
        username: 'team_leader_ayse',
        password,
        role: user_entity_1.UserRole.TEAM_LEADER,
        rank: user_entity_1.UserRank.LEAD,
        managerId: admin.id,
    });
    const senior1 = await userRepo.save({
        username: 'mehmet_senior',
        password,
        role: user_entity_1.UserRole.EMPLOYEE,
        rank: user_entity_1.UserRank.SENIOR,
        managerId: teamLeader1.id,
    });
    const middle1 = await userRepo.save({
        username: 'fatma_middle',
        password,
        role: user_entity_1.UserRole.EMPLOYEE,
        rank: user_entity_1.UserRank.MIDDLE,
        managerId: teamLeader1.id,
    });
    const junior1 = await userRepo.save({
        username: 'ali_junior',
        password,
        role: user_entity_1.UserRole.EMPLOYEE,
        rank: user_entity_1.UserRank.JUNIOR,
        managerId: teamLeader1.id,
    });
    const junior2 = await userRepo.save({
        username: 'zeynep_junior',
        password,
        role: user_entity_1.UserRole.EMPLOYEE,
        rank: user_entity_1.UserRank.JUNIOR,
        managerId: teamLeader2.id,
    });
    const middle2 = await userRepo.save({
        username: 'mustafa_middle',
        password,
        role: user_entity_1.UserRole.EMPLOYEE,
        rank: user_entity_1.UserRank.MIDDLE,
        managerId: teamLeader2.id,
    });
    console.log('Created 7 users');
    const project1 = await projectRepo.save({
        name: 'E-Commerce Platform',
        description: 'Online shopping platform with payment integration',
        leaderId: teamLeader1.id,
    });
    const project2 = await projectRepo.save({
        name: 'Mobile App',
        description: 'Cross-platform mobile application',
        leaderId: teamLeader2.id,
    });
    const project3 = await projectRepo.save({
        name: 'Internal CRM',
        description: 'Customer relationship management system',
        leaderId: teamLeader1.id,
    });
    console.log('Created 3 projects');
    const today = new Date();
    const reports = [
        {
            content: 'Bugün e-ticaret platformu için ödeme entegrasyonu üzerinde çalıştım. Stripe API ile ödeme sayfasını başarıyla entegre ettim.',
            user: senior1,
            project: project1,
            date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
        },
        {
            content: 'Kullanıcı dashboard tasarımını güncelledim. Responsive tasarım için CSS düzenlemeleri yaptım.',
            user: middle1,
            project: project1,
            date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
        },
        {
            content: 'Mobil uygulama için onboarding ekranı tasarladım ve React Native componentleri oluşturdum.',
            user: junior2,
            project: project2,
            date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
        },
        {
            content: 'CRM için müşteri listesi API endpointlerini yazdım. GET, POST, PUT, DELETE metodlarını implmente ettim.',
            user: middle2,
            project: project3,
            date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
        },
        {
            content: 'Bugün yeni junior developerlara code review yaptım. Git flow ve best practices hakkında eğitim verdim.',
            user: teamLeader1,
            project: project1,
            date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
        },
        {
            content: 'E-ticaret sitesi için sepet fonksiyonu geliştirdim. Local storage entegrasyonu yaptım.',
            user: junior1,
            project: project1,
            date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
        {
            content: 'Mobil uygulama için push notification altyapısını kurdum. Firebase Cloud Messaging entegrasyonu tamamlandı.',
            user: teamLeader2,
            project: project2,
            date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
        {
            content: 'Database şemasını güncelledim. Müşteri tablosuna yeni alanlar ekledim.',
            user: senior1,
            project: project3,
            date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
    ];
    for (const report of reports) {
        await dailyRepo.save(report);
    }
    console.log('Created 8 daily reports');
    console.log('\n✅ Seed completed!\n');
    console.log('Users (password: password123):');
    console.log('  - admin (Admin - Manager)');
    console.log('  - team_leader_ahmet (Team Leader - Lead)');
    console.log('  - team_leader_ayse (Team Leader - Lead)');
    console.log('  - mehmet_senior (Employee - Senior)');
    console.log('  - fatma_middle (Employee - Middle)');
    console.log('  - ali_junior (Employee - Junior)');
    console.log('  - zeynep_junior (Employee - Junior)');
    console.log('  - mustafa_middle (Employee - Middle)');
    console.log('\nProjects:');
    console.log('  - E-Commerce Platform');
    console.log('  - Mobile App');
    console.log('  - Internal CRM');
    await app.close();
}
seed();
//# sourceMappingURL=seed.js.map