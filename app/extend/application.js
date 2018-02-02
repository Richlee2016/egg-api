const APIDOC = Symbol("apiDocument")
module.exports = {
  apiDoc:{},
  routerParse(router, controller) {
    const ALLOW = ["get", "post", "delete", "single"];
    let apiDoc = [];
    const disPath = str => {
      const reg = /(\w+)_(\w+)/;
      const m = str.match(reg);
      return {
        methods: m ? m[1] : "",
        path: m ? m[2] : ""
      };
    };
    Object.keys(controller).forEach(path => {
      let alldoc = {
        api:path,
        group:[]
      }
      Object.keys(controller[path]).forEach(o => {
        let doc={}
        const myRouter = disPath(o);
        // console.log(myRouter, ALLOW.indexOf(myRouter.methods));
        if (ALLOW.indexOf(myRouter.methods) === -1) {
          return;
        }
        if (ALLOW.indexOf(myRouter.methods) === 3) {
          doc = {
            method:'get',
            path:`/api/${path}/${myRouter.path}/:id`
          }
          router.get(
            `/api/${path}/${myRouter.path}/:id`,
            controller[path][o]
          );
          return;
        }
        // console.log(myRouter.methods,`/api/${path}/${myRouter.path}`);
        doc = {
          method:myRouter.methods,
          path:`/api/${path}/${myRouter.path}`
        }
        alldoc.group.push(doc);
        router[myRouter.methods](
          `/api/${path}/${myRouter.path}`,
          controller[path][o]
        );
      });
      apiDoc.push(alldoc);
    });
    return apiDoc;
  }
};
