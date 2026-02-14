

const HandleAsync = (requestHandler)=>{
    return(req, res, next)=>{
        Promise.resolve(
            requestHandler(req, res, next)
        ).catch( (error)=>{
                next(error)
            })
    }
}


export {HandleAsync}


// const handleAsync = ()=>{()=>{}} same shit as below
// try catch method
// const handleAsync = (requestHandler)=>async (req, res, next)=>{
//     try {
//         await requestHandler(req, res, next)
//     } catch (error) {
//         res.status(error.code || 400).json({
//             success:false,
//             message: error.message
//         })
//     }
// }