import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User, UserRole, UserRank } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { Daily } from './daily/entities/daily.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  const userRepo = dataSource.getRepository(User);
  const projectRepo = dataSource.getRepository(Project);
  const dailyRepo = dataSource.getRepository(Daily);

  console.log('Seeding database...');

  // Clear existing data
  await dailyRepo.createQueryBuilder().delete().execute();
  await projectRepo.createQueryBuilder().delete().execute();
  await userRepo.createQueryBuilder().delete().execute();

  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('password123', salt);

  // Create users
  const admin = await userRepo.save({
    username: 'admin',
    password,
    role: UserRole.ADMIN,
    rank: UserRank.MANAGER,
  });

  const teamLeader1 = await userRepo.save({
    username: 'team_leader_ahmet',
    password,
    role: UserRole.TEAM_LEADER,
    rank: UserRank.LEAD,
    managerId: admin.id,
  });

  const teamLeader2 = await userRepo.save({
    username: 'team_leader_ayse',
    password,
    role: UserRole.TEAM_LEADER,
    rank: UserRank.LEAD,
    managerId: admin.id,
  });

  const senior1 = await userRepo.save({
    username: 'mehmet_senior',
    password,
    role: UserRole.EMPLOYEE,
    rank: UserRank.SENIOR,
    managerId: teamLeader1.id,
  });

  const middle1 = await userRepo.save({
    username: 'fatma_middle',
    password,
    role: UserRole.EMPLOYEE,
    rank: UserRank.MIDDLE,
    managerId: teamLeader1.id,
  });

  const junior1 = await userRepo.save({
    username: 'ali_junior',
    password,
    role: UserRole.EMPLOYEE,
    rank: UserRank.JUNIOR,
    managerId: teamLeader1.id,
  });

  const junior2 = await userRepo.save({
    username: 'zeynep_junior',
    password,
    role: UserRole.EMPLOYEE,
    rank: UserRank.JUNIOR,
    managerId: teamLeader2.id,
  });

  const middle2 = await userRepo.save({
    username: 'mustafa_middle',
    password,
    role: UserRole.EMPLOYEE,
    rank: UserRank.MIDDLE,
    managerId: teamLeader2.id,
  });

  console.log('Created 7 users');

  // Create projects
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

  // Create daily reports
  const today = new Date();
  const reports = [
    {
      content:
        'Bugün e-ticaret platformu için ödeme entegrasyonu üzerinde çalıştım. Stripe API ile ödeme sayfasını başarıyla entegre ettim.',
      user: senior1,
      project: project1,
      date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
    },
    {
      content:
        'Kullanıcı dashboard tasarımını güncelledim. Responsive tasarım için CSS düzenlemeleri yaptım.',
      user: middle1,
      project: project1,
      date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
    },
    {
      content:
        'Mobil uygulama için onboarding ekranı tasarladım ve React Native componentleri oluşturdum.',
      user: junior2,
      project: project2,
      date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
    },
    {
      content:
        'CRM için müşteri listesi API endpointlerini yazdım. GET, POST, PUT, DELETE metodlarını implmente ettim.',
      user: middle2,
      project: project3,
      date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
    },
    {
      content:
        'Bugün yeni junior developerlara code review yaptım. Git flow ve best practices hakkında eğitim verdim.',
      user: teamLeader1,
      project: project1,
      date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000),
    },
    {
      content:
        'E-ticaret sitesi için sepet fonksiyonu geliştirdim. Local storage entegrasyonu yaptım.',
      user: junior1,
      project: project1,
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      content:
        'Mobil uygulama için push notification altyapısını kurdum. Firebase Cloud Messaging entegrasyonu tamamlandı.',
      user: teamLeader2,
      project: project2,
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      content:
        'Database şemasını güncelledim. Müşteri tablosuna yeni alanlar ekledim.',
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
