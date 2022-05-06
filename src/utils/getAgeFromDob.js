function getAge(dob){

    let date=dob.getDate();
    let month=dob.getMonth();
    let year=dob.getFullYear();
    let presentdate=new Date();
    let age=presentdate.getFullYear()-year;
    if(presentdate.getMonth()-month<0)
    age--;
    else if(+presentdate.getMonth()-month===0 && +presentdate.getDate()-date<0)
    age--;
    
    return age;
     }
    module.exports=getAge;
    
