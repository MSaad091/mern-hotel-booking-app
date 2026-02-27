import multer from 'multer'
import path from 'path'


const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,path.join(process.cwd(), 'public','temp'))
    },
    filename: (req,file,cb) => {
        const uniqueSuffix = Date.now( )  + '_'+ Math.round(Math.random() * 1E9)
        cb(null,uniqueSuffix + '_' + file.originalname)
    }
})

const upload = multer({storage})

export {upload}



