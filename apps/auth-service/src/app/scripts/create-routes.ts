// import 'reflect-metadata';
// import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';
// import * as path from 'path';
// import { StringUtils } from '../utilities/stringutils';
// import { role, Role } from '../auth/role.entity';
// import { Authorization } from '../auth/auth.entity';
// import { user } from '../auth/user.entity';

// dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
// // console.log("database",process.env.DB_HOST);  // Test to ensure it's loaded correctly
// const readOnlyMethods = ['GET'];
// const partialReadWriteMethods = ['POST'];
// const writeMethods = ['DELETE', 'PUT', 'PATCH'];

// const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [user, Role, Authorization],
//   synchronize: process.env.DB_SYNCHRONIZE === 'false',
//   logging: process.env.DB_LOGGING === 'false',
// });

// async function createRolesIfNotExist(dataSource: DataSource) {
//   const roles = [role.ADMIN, role.STUDENT, role.EMPLOYEE];
//   const roleRepository = dataSource.getRepository(Role);

//   for (const roleName of roles) {
//     let roleEntity = await roleRepository.findOne({
//       where: { role: roleName },
//     });

//     if (!roleEntity) {
//       roleEntity = roleRepository.create({
//         id: StringUtils.generateRandomAlphaNumeric(4),
//         role: roleName,
//       });
//       await roleRepository.save(roleEntity);
//       console.log(`Created role: ${roleName}`);
//     }
//   }
// }

// function setAuthorizationPermissions(
//   role: Role,
//   path: string,
//   methods: string[],
// ): Authorization {
//   const authorization = new Authorization();
//   authorization.id = StringUtils.generateRandomAlphaNumeric(4);
//   authorization.role = role;
//   authorization.path = path;
//   authorization.methods = methods;
//   return authorization;
// }

// function getAdminPermissions(role: Role): Authorization[] {
//   return [setAuthorizationPermissions(role, '/test', [...readOnlyMethods])];
// }

// function getUserPermissions(role: Role): Authorization[] {
//   return [
//     setAuthorizationPermissions(role, '/advertisement', [...readOnlyMethods]),
//   ];
// }

// function getStudentPermissions(role: Role): Authorization[] {
//   return [];
// }

// function getTeacherPermissions(role: Role): Authorization[] {
//   return [];
// }
// function getEmployeePermissions(role: Role): Authorization[] {
//   return [setAuthorizationPermissions(role, '/test', [...readOnlyMethods])];
// }

// async function createRole() {
//   try {
//     await AppDataSource.initialize();
//     console.log('Data Source has been initialized!');

//     await createRolesIfNotExist(AppDataSource);

//     const roleRepository = AppDataSource.getRepository(Role);
//     const [adminRole, studentRole, employeeRole] = await Promise.all([
//       roleRepository.findOne({ where: { role: role.ADMIN } }),
//       roleRepository.findOne({ where: { role: role.STUDENT } }),
//       roleRepository.findOne({ where: { role: role.EMPLOYEE } }),
//     ]);

//     if (!adminRole || !studentRole || !employeeRole) {
//       throw new Error('One or more roles not found');
//     }

//     const authorizations = [
//       ...getAdminPermissions(adminRole),
//       ...getStudentPermissions(studentRole),
//       ...getEmployeePermissions(employeeRole),
//     ];

//     console.log('Authorizations to save:', authorizations);

//     await AppDataSource.manager.save(Authorization, authorizations);
//     console.log('Saved authorizations!');
//   } catch (error) {
//     console.error('Error creating roles and auth', error);
//   } finally {
//     await AppDataSource.destroy();
//     console.log('Data Source connection closed.');
//   }
// }

// createRole().then();
