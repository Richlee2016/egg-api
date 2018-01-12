module.exports = {
  routerParse(router, controller) {
    return path => {
      const disPath = str => {
        const reg = /(\w+)_(\w+)/;
        const m = str.match(reg);
        return {
          methods: m[1],
          path: m[2]
        };
      };
      Object.keys(controller[path]).forEach(o => {
        const myRouter = disPath(o);
        router[myRouter.methods](
          `/api/${path}/${myRouter.path}`,
          controller.movies[o]
        );
      });
    };
  }
};
