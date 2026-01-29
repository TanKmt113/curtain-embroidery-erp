import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      fullName: 'System Administrator',
      phone: '0901234567',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create sales user
  const salesPassword = await bcrypt.hash('sales123', 10);
  const sales = await prisma.user.upsert({
    where: { email: 'sales@example.com' },
    update: {},
    create: {
      email: 'sales@example.com',
      passwordHash: salesPassword,
      fullName: 'Sales Person',
      phone: '0901234568',
      role: 'SALES',
      status: 'ACTIVE',
    },
  });
  console.log('Created sales user:', sales.email);

  // Create sample customers
  const customers = [
    {
      code: 'CUS-0001',
      name: 'Nguyễn Văn A',
      type: 'INDIVIDUAL' as const,
      email: 'nguyenvana@example.com',
      phone: '0912345678',
      address: '123 Nguyễn Huệ, Q1, HCM',
    },
    {
      code: 'CUS-0002',
      name: 'Công ty TNHH ABC',
      type: 'COMPANY' as const,
      email: 'contact@abc.com',
      phone: '0283456789',
      address: '456 Lê Lợi, Q1, HCM',
      taxCode: '0123456789',
      contactPerson: 'Trần Văn B',
    },
    {
      code: 'CUS-0003',
      name: 'Xưởng May XYZ',
      type: 'CONSIGNMENT' as const,
      email: 'xuongmay@xyz.com',
      phone: '0287654321',
      address: '789 Cách Mạng Tháng 8, Q3, HCM',
      notes: 'Khách ký gửi hàng gia công',
    },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { code: customer.code },
      update: {},
      create: customer,
    });
    console.log('Created customer:', customer.name);
  }

  // Create sample products
  const products = [
    {
      code: 'PRD-REM-001',
      name: 'Rèm vải thô cao cấp',
      type: 'CURTAIN' as const,
      unit: 'm2',
      basePrice: 250000,
      description: 'Rèm vải thô nhập khẩu, chống nắng tốt',
    },
    {
      code: 'PRD-REM-002',
      name: 'Rèm cuốn văn phòng',
      type: 'CURTAIN' as const,
      unit: 'm2',
      basePrice: 180000,
      description: 'Rèm cuốn chống nắng cho văn phòng',
    },
    {
      code: 'PRD-GC-001',
      name: 'Gia công thêu logo',
      type: 'EMBROIDERY' as const,
      unit: 'cái',
      basePrice: 15000,
      description: 'Thêu logo theo mẫu khách hàng',
    },
    {
      code: 'PRD-GC-002',
      name: 'Gia công đệm ghế',
      type: 'EMBROIDERY' as const,
      unit: 'cái',
      basePrice: 50000,
      description: 'May đệm ghế theo kích thước',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: {},
      create: product,
    });
    console.log('Created product:', product.name);
  }

  // Create sample materials
  const materials = [
    {
      code: 'MAT-001',
      name: 'Vải thô cao cấp',
      unit: 'm',
      minStock: 100,
      description: 'Vải thô nhập khẩu Hàn Quốc',
    },
    {
      code: 'MAT-002',
      name: 'Vải cuốn văn phòng',
      unit: 'm',
      minStock: 50,
      description: 'Vải chuyên dụng cho rèm cuốn',
    },
    {
      code: 'MAT-003',
      name: 'Chỉ thêu các màu',
      unit: 'cuộn',
      minStock: 20,
      description: 'Chỉ thêu chất lượng cao',
    },
    {
      code: 'MAT-004',
      name: 'Mút xốp 2cm',
      unit: 'm2',
      minStock: 30,
      description: 'Mút xốp làm đệm',
    },
  ];

  for (const material of materials) {
    await prisma.material.upsert({
      where: { code: material.code },
      update: {},
      create: material,
    });
    console.log('Created material:', material.name);
  }

  // Create routing steps for curtain product
  const curtainProduct = await prisma.product.findUnique({
    where: { code: 'PRD-REM-001' },
  });

  if (curtainProduct) {
    const curtainSteps = [
      { stepNumber: 1, name: 'Cắt vải', workCenter: 'Xưởng cắt', estimatedTime: 30 },
      { stepNumber: 2, name: 'May viền', workCenter: 'Xưởng may', estimatedTime: 60 },
      { stepNumber: 3, name: 'Gắn phụ kiện', workCenter: 'Xưởng lắp ráp', estimatedTime: 20 },
      { stepNumber: 4, name: 'Ủi/Hoàn thiện', workCenter: 'Xưởng hoàn thiện', estimatedTime: 15 },
      { stepNumber: 5, name: 'Đóng gói', workCenter: 'Kho', estimatedTime: 10 },
    ];

    for (const step of curtainSteps) {
      await prisma.routingStep.upsert({
        where: {
          productId_stepNumber: {
            productId: curtainProduct.id,
            stepNumber: step.stepNumber,
          },
        },
        update: {},
        create: {
          productId: curtainProduct.id,
          ...step,
        },
      });
    }
    console.log('Created routing steps for curtain product');
  }

  // Create routing steps for embroidery product
  const embroideryProduct = await prisma.product.findUnique({
    where: { code: 'PRD-GC-001' },
  });

  if (embroideryProduct) {
    const embroiderySteps = [
      { stepNumber: 1, name: 'Nhận hàng/Kiểm đếm', workCenter: 'Kho', estimatedTime: 15 },
      { stepNumber: 2, name: 'Căng khung', workCenter: 'Xưởng thêu', estimatedTime: 10 },
      { stepNumber: 3, name: 'Thêu', workCenter: 'Xưởng thêu', estimatedTime: 45 },
      { stepNumber: 4, name: 'Tháo khung/Cắt chỉ', workCenter: 'Xưởng hoàn thiện', estimatedTime: 10 },
      { stepNumber: 5, name: 'Kiểm tra/Đóng gói', workCenter: 'Kho', estimatedTime: 10 },
    ];

    for (const step of embroiderySteps) {
      await prisma.routingStep.upsert({
        where: {
          productId_stepNumber: {
            productId: embroideryProduct.id,
            stepNumber: step.stepNumber,
          },
        },
        update: {},
        create: {
          productId: embroideryProduct.id,
          ...step,
        },
      });
    }
    console.log('Created routing steps for embroidery product');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
