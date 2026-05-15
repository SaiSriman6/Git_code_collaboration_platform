export const checkRole=(role)=>{
return(req,res,next)=>{

if(req.user.role!==role){
return res.status(403).json({message:"Access denied"});
}

next();

};
};

// Allow multiple roles
export const checkRoles = (...roles) => {
return (req,res,next)=>{

if(!req.user){
return res.status(401).json({message:"Unauthorized"});
}

if(!roles.includes(req.user.role)){
return res.status(403).json({message:"Access denied"});
}

next();

};
};



// Optional authentication middleware
export const optionalAuth = (req,res,next)=>{

try{

const token=req.cookies.token;

if(!token){
return next();
}

const decoded=jwt.verify(token,process.env.JWT_SECRET);

req.user=decoded;

next();

}catch(err){
next();
}

};



// Safe token verification with error handling
export const verifyTokenSafe = (req,res,next)=>{

try{

const token=req.cookies.token;

if(!token){
return res.status(401).json({
message:"Unauthorized"
});
}

const decoded=jwt.verify(token,process.env.JWT_SECRET);

req.user=decoded;

next();

}catch(err){

return res.status(401).json({
message:"Invalid or expired token"
});

}

};



// Check if user is repository owner
export const checkOwner = (req,res,next)=>{

if(!req.user){
return res.status(401).json({
message:"Unauthorized"
});
}

if(req.user.role !== "owner"){
return res.status(403).json({
message:"Only repository owner allowed"
});
}

next();

};