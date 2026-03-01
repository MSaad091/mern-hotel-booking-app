// import multer from 'multer'
// import path from 'path'


// const storage = multer.diskStorage({
//     destination: (req,file,cb) => {
//         cb(null,path.join(process.cwd(), 'public','temp'))
//     },
//     filename: (req,file,cb) => {
//         const uniqueSuffix = Date.now( )  + '_'+ Math.round(Math.random() * 1E9)
//         cb(null,uniqueSuffix + '_' + file.originalname)
//     }
// })

// const upload = multer({storage})

// export {upload}



// import multer from 'multer';

// // Render ke liye memoryStorage best hai kyunki disk par file save karne ki permission nahi chahiye hoti
// const storage = multer.memoryStorage();

// const upload = multer({ 
//     storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB limit
//     }
// });

// export { upload };
import multer from 'multer';

// Purana diskStorage wala code hata dein
const storage = multer.memoryStorage(); // Ye line buffer enable karegi

const upload = multer({ storage });

export { upload };