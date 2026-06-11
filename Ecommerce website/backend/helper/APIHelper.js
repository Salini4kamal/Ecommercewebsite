class APIHelper{
    constructor(query,queryStr){
        this.query=query;  //MongoDb Query
        this.queryStr=queryStr; //Query string from URL
    }
    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            }
        }:{};
        this.query=this.query.find({...keyword})
        return this;
    }
    filter(){
        const queryCopy={...this.queryStr};
        const removeFields=["keyword","page","limit"];
        removeFields.forEach((key) => delete queryCopy[key]);
        this.query=this.query.find(queryCopy);
        return this;

    }
    pagination(resultPerPage){
const currentPage=Number(this.queryStr.page) || 1;
const skip=resultPerPage * (currentPage-1);
this .query=this.query.limit(resultPerPage).skip(skip);
return this;
    }
}
export default APIHelper;
// db.products.find({
//     name:{
//         $regex:'sapiens:mskmxkss xs',
//         $options:"i",
//     },
//     catagory:"Pen"
// })
