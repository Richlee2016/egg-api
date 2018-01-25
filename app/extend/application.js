module.exports = {
  routerParse(router, controller) {
    const ALLOW = ["get", "post", "delete", "single"];
    const disPath = str => {
      const reg = /(\w+)_(\w+)/;
      const m = str.match(reg);
      return {
        methods: m ? m[1] : "",
        path: m ? m[2] : ""
      };
    };
    Object.keys(controller).forEach(path => {
      Object.keys(controller[path]).forEach(o => {
        const myRouter = disPath(o);
        // console.log(myRouter, ALLOW.indexOf(myRouter.methods));
        if (ALLOW.indexOf(myRouter.methods) === -1) {
          return;
        }
        if (ALLOW.indexOf(myRouter.methods) === 3) {
          router.get(
            `/api/${path}/${myRouter.path}/:id`,
            controller[path][o]
          );
          return;
        }
        // console.log(myRouter.methods,`/api/${path}/${myRouter.path}`);
        router[myRouter.methods](
          `/api/${path}/${myRouter.path}`,
          controller[path][o]
        );
      });
    });
  }
};
