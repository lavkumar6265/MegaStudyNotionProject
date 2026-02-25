const Tag = require("../models/tags");

//create tag handler function 
exports.createCategery = async(req,res) =>{
    try{
        const{name,description} = req.body;

        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        //create entry at db
        const tagDetails = await Tag.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Tag created Successfully",
        })
    }
    
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//get all tags

exports.showAllCategery = async(req,res)=>{
    try{
        const allTags = await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"All tags refured successfully",
            allTags,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}