import { USER_ROLE } from '@prisma/client';
import prisma from '../prisma';
import { hashPassword } from './authHelper';
import env from '@/config/env';

const seedAdmin = async () => {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: USER_ROLE.admin },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(env.admin_password);

    await prisma.user.create({
      data: {
        name: 'ADMIN',
        email: env.admin_email,
        role: USER_ROLE.admin,
        password: hashedPassword,
      },
    });

    console.log('✅ Admin user seeded successfully.');
  } else {
    console.log('ℹ️ Admin user already exists.');
  }
};

export default seedAdmin;
