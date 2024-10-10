export const config = () => {
  const { env } = process;

  return {
    service: {
      name: env.APP_NAME,
      description: env.APP_DESCRIPTION,
      version: env.APP_VERSION,
      maintainer: env.MAINTAINER_NAME,
      admin: {
        host: env.ADMIN_SERVICE_HOST,
        port: env.ADMIN_SERVICE_PORT,
      },
      customer: {
        host: env.CUSTOMER_SERVICE_HOST,
        port: env.CUSTOMER_SERVICE_PORT,
      },
      vendor: {
        host: env.VENDOR_SERVICE_HOST,
        port: env.VENDOR_SERVICE_PORT,
      },
    },

    mysql: {
      host: env.MYSQL_HOST,
      port: Number(env.MYSQL_PORT),
      dbname: env.MYSQL_DBNAME,
      user: env.MYSQL_USER,
      pass: env.MYSQL_PASS,
    },

    password: {
      rounds: env.PASSWORD_ROUNDS,
    },

    jwt: {
      expired_time: env.JWT_EXPIRED_TIME,
      secret: env.JWT_SECRET,
    },
  };
};

export type Config = ReturnType<typeof config>;
