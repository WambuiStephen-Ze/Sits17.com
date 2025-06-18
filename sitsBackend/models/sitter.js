import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

// const sitterId = button.getAttribute("data-sitter-id"); // get sitterId from button
// if (!sitterId) {
//   console.error("No sitter ID found for this button");
  // return;
// }

// const bookingData = {
//   userId: 1, // Replace with actual logged-in user ID
//   sitterId: parseInt(sitterId),
//   date: new Date().toISOString(),
//   duration: 2,
//   confirmationEmail: true
// // };
// document.querySelectorAll(".bookme").forEach(button => {
//   button.addEventListener("click", async () => {
//     const sitterId = button.getAttribute("data-sitter-id");

//     if (!sitterId) {
//       alert("Sitter ID is missing!");
//       return;
//     }

//     const bookingData = {
//       userId: 1,
//       sitterId: parseInt(sitterId),
//       date: new Date().toISOString(),
//       duration: 2,
//       confirmationEmail: true
//     };

//     // Fetch to backend API here...
//   });
// });


export default (sequelize) => {
  return sequelize.define(
    'sitter',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      availability: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/i,
        },
      },
    },
    {
      timestamps: false,
      tableName: 'sitters',
      hooks: {
        beforeCreate: async (sitter) => {
          if (sitter.password) {
            const salt = await bcrypt.genSalt(10);
            sitter.password = await bcrypt.hash(sitter.password, salt);
          }
        },
        beforeUpdate: async (sitter) => {
          if (sitter.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            sitter.password = await bcrypt.hash(sitter.password, salt);
          }
        },
      },
    }
  );
};


