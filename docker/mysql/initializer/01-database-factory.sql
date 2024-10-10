CREATE DATABASE IF NOT EXISTS `apps_admin`;
CREATE DATABASE IF NOT EXISTS `apps_vendor`;
CREATE DATABASE IF NOT EXISTS `apps_customer`;

CREATE USER 'procurement'@'%' IDENTIFIED BY 'procurement';

GRANT ALL PRIVILEGES ON `apps_admin`.* TO 'procurement'@'%';
GRANT ALL PRIVILEGES ON `apps_vendor`.* TO 'procurement'@'%';
GRANT ALL PRIVILEGES ON `apps_customer`.* TO 'procurement'@'%';