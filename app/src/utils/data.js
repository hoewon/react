// const Category = AV.Object.extend('Category');
import AV from 'leancloud-storage';


function searchCategory(text) {
  console.log('text',text);
  return new AV.Promise(function (resolve){

    var q = new AV.Query('Category');
    q.startsWith('title', text);
    q.ascending('title');
    q.limit(20);
    // q.equalTo('category', category);
    // 加入可被标签使用的限制

    q.find().then(function(r1) {
      var r2 = JSON.parse(JSON.stringify(r1));
      // console.log(r2);

      resolve(r2);

    });
  })
};

function searchCook(text) {

  return new AV.Promise(function (resolve){
    var q = new AV.Query('_User');
    q.contains('username', text);

    q.limit(20);
    // 加入发布者资格的限制

    q.find().then(function(r1) {
      var r2 = JSON.parse(JSON.stringify(r1));
      resolve(r2);
    });
  })
};

module.exports = {
  searchCat:searchCategory,
  searchCook:searchCook,
}

// exports.time = time;