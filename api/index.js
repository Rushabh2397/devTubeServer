module.exports = (app,apiBase)=>{

    require('./admin')(app,`${apiBase}/admin`)
    require('./v1')(app,`${apiBase}/v1`)

}