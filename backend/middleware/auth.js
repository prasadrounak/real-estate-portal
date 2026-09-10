import jwt from 'jsonwebtoken';
export function auth(req,res,next){
 const h=req.headers.authorization||'', token=h.startsWith('Bearer ')?h.slice(7):null;
 if(!token)return res.status(401).json({message:'Please login first.'});
 try{req.user=jwt.verify(token,process.env.JWT_SECRET);next();}
 catch{return res.status(401).json({message:'Session expired. Please login again.'});}
}
export function adminOnly(req,res,next){
 if(req.user?.role!=='admin')return res.status(403).json({message:'Admin access required.'});
 next();
}
