// // models/userModel.js

// import { DataTypes } from 'sequelize';
// import bcrypt from 'bcryptjs';

// /**
//  * Defines the User model
//  * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
//  * @returns {import('sequelize').Model} User model
//  */
// export default (sequelize) => {
//   const User = sequelize.define('user', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     role: {
//       type: DataTypes.STRING,
//       allowNull: true, // 'parent' or 'sitter'
//     },
//     profilePic: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     location: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     numberOfChildren: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//   }, {
//     timestamps: false,
//     tableName: 'users',
//     hooks: {
//       beforeCreate: async (user) => {
//         if (user.password) {
//           const salt = await bcrypt.genSalt(10);
//           user.password = await bcrypt.hash(user.password, salt);
//         }
//       },
//       beforeUpdate: async (user) => {
//         if (user.changed('password')) { // Only hash if password was changed
//           const salt = await bcrypt.genSalt(10);
//           user.password = await bcrypt.hash(user.password, salt);
//         }
//       },
//     },
//   });

//   return User;
// };
// models/userModel.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const userModel = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberOfChildren: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  return User;
};

export default userModel;
