
const fs = require("fs")
const path = require("path")
const _ =  require("lodash")
module.exports = {
  apiDocument() {
    const apis =  fs.readFileSync(path.resolve(__dirname, "../../run/router.json"), "utf-8");
    let nameArr=[],apiBox=[];
    const myPath = JSON.parse(apis).map(o => {
      let method;
      if(o.methods[0] === "POST"){
        method = 'POST'
      }else{
        method = 'GET'
      };
      nameArr.push(o.name || "all");
      return {
        name:o.name,
        method,
        path:o.path
      }
    })
    const onlyName = Array.from(new Set(nameArr));
    onlyName.forEach(o =>{
      let box = {
        name :o,
        apiList:[]
      };
      myPath.forEach(a => {
        if(o === a.name){
          box.apiList.push(a);
        };
      })
      apiBox.push(box);
    })
    return apiBox;
  },
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
            `${path}`,
            `/api/${path}/${myRouter.path}/:id`,
            controller[path][o]
          );
          return;
        }
        router[myRouter.methods](
          `${path}`,
          `/api/${path}/${myRouter.path}`,
          controller[path][o]
        );
      });
    });
  }
};
