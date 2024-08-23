import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        // Upload File On CloudInary....
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })

        // File Uploaded SuccessFully........
        console.log("File Uploaded SuccessFully");
        console.log(response.url)
        return response
    } catch (error) {
        // Unlink The File If Any Error Ocuured.....
        fs.unlinkSync(localFilePath)
        return null
    }

}


export { uploadCloudinary }