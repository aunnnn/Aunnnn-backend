'use strict';

module.exports = function(app) {
  var User = app.models.User;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var password = process.env.ADMIN_PASSWORD;

  User.destroyAll(function(err, res) {
    if (err) throw err;
    console.log('Total ' + res.count + ' user(s) are deleted.');
    Role.destroyAll(function(err, res) {
      if (err) throw err;
      console.log('Total ' + res.count + ' role(s) are deleted.');

      if (!password) {
        console.log('Error: ADMIN_PASSWORD not provided. Please restart the app.');
        return;
      }

      User.create([
        {
          username: 'aunnnn',
          email: 'aun.rueopas@gmail.com',
          password: password,
        },
      ], function(err, users) {
        if (!err) {
          console.log('--> Admin is created.');
          //create the admin role
          Role.create({
            name: 'admin',
          }, function(err, role) {
            if (err) throw err;

            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[0].id,
            }, function(err, principal) {
              if (err) throw err;
              console.log('--> Admin role is assigned.');
            });
          });
        } else {
          console.log('--> Cannot create admin: ' + err);
        }
      });
    });
  });
};
