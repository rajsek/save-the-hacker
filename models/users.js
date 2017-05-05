'use strict';
module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define('users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_fb: DataTypes.BIGINT,
        id_twitter: DataTypes.BIGINT,
        locale: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        screen_name: DataTypes.STRING,
        oauth_token: DataTypes.STRING,
        oauth_secret: DataTypes.STRING,
        email: DataTypes.STRING,
        gender: DataTypes.STRING,
        ip: DataTypes.STRING,
        ua: DataTypes.STRING,
        date_visited: DataTypes.INTEGER,
        date_auth: DataTypes.INTEGER
    }, {
            timestamps: false,
            classMethods: {
                associate: function (models) {
                    // associations can be defined here
                }
            }
        });
    return users;
};
