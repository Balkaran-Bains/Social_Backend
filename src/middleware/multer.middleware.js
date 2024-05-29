// this code sets up a Multer middleware that will handle file uploads,
// saving the uploaded files to the "./public/temp" directory with their 
// original filenames.

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // this specifies the destination directory where uploaded files will be stored on the server's disk.
      cb(null, "./public/temp")
    },

    // determines the file name of the uploaded file,
    filename: function (req, file, cb) { 
      
      cb(null, file.originalname)
    }
  })
  
 export const upload = multer({ storage })