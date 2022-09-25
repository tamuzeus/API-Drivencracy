function hasInfos (req, res, next){
    const { title } = req.body;
    console.log('MIDDLEWARE: ', title)

    if(!title){
        return res.send(401);
    };
    next();
}

export default hasInfos;