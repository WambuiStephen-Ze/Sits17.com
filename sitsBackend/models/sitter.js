import { Sequelize } from 'sequelize';

export default (sequelize) => {
  const Sitter = sequelize.define('sitter', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      // to Ensure email uniqueness
      unique: true, 
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    experience: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    availability: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    profilePic: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'sitters',
    hooks: {
      beforeCreate: async (sitter) => {
        if (sitter.password) {
          const salt = await import('bcryptjs').then(({ default: bcrypt }) => bcrypt.genSalt(10));
          sitter.password = await import('bcryptjs').then(({ default: bcrypt }) => bcrypt.hash(sitter.password, salt));
        }
      },
      beforeUpdate: async (sitter) => {
        if (sitter.password) {
          const salt = await import('bcryptjs').then(({ default: bcrypt }) => bcrypt.genSalt(10));
          sitter.password = await import('bcryptjs').then(({ default: bcrypt }) => bcrypt.hash(sitter.password, salt));
        }
      },
    },
  });

  return Sitter;
};