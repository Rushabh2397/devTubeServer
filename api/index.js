module.exports = (app,apiBase)=>{

    require('./admin')(app,`${apiBase}/admin`)

}