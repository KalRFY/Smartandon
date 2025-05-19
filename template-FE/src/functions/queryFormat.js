function queryFormat(object) {
    let containerQuery = [];
  
    for (const key in object) {
      const element = object[key];
      console.log(key, element);
      if (element != "" && element && element != 0 && element != "-1") {
        containerQuery.push(`${key}=${element}`);
      }
    }
    return containerQuery.join("&");
  }
  
  export default queryFormat;