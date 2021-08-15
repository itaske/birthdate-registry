var Migrations = artifacts.require("./BirthDateRegistry.sol");

module.exports = function(deployer){
    deployer.deploy(Migrations);
};