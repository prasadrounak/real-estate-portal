import express from 'express';
import pool from '../config/db.js';
import {auth,adminOnly} from '../middleware/auth.js';
const router=express.Router();
const select=`SELECT p.*,u.name owner_name,u.email owner_email,u.phone owner_phone FROM properties p LEFT JOIN users u ON p.owner_id=u.id`;
router.get('/',async(req,res)=>{
 try{
  const {search='',location='',type='',purpose='',minPrice='',maxPrice='',bedrooms=''}=req.query;
  let sql=select+` WHERE p.status='active'`,a=[];
  if(search){sql+=' AND (p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ?)';a.push(`%${search}%`,`%${search}%`,`%${search}%`);}
  if(location){sql+=' AND p.location LIKE ?';a.push(`%${location}%`);}
  if(type){sql+=' AND p.property_type=?';a.push(type);}
  if(purpose){sql+=' AND p.purpose=?';a.push(purpose);}
  if(minPrice!==''){sql+=' AND p.price>=?';a.push(Number(minPrice));}
  if(maxPrice!==''){sql+=' AND p.price<=?';a.push(Number(maxPrice));}
  if(bedrooms!==''){sql+=' AND p.bedrooms>=?';a.push(Number(bedrooms));}
  sql+=' ORDER BY p.created_at DESC';const [rows]=await pool.query(sql,a);res.json(rows);
 }catch(err){console.error(err);res.status(500).json({message:'Could not load properties.'});}
});
router.get('/:id',async(req,res)=>{try{const[r]=await pool.query(select+' WHERE p.id=?',[req.params.id]);if(!r.length)return res.status(404).json({message:'Property not found.'});res.json(r[0]);}catch{res.status(500).json({message:'Could not load property.'});}});
router.post('/',auth,adminOnly,async(req,res)=>{
 try{
  const{x}=req.body;const b=req.body;
  if(!b.title||!b.description||!b.price||!b.location||!b.property_type)return res.status(400).json({message:'Title, description, price, location and type are required.'});
  const[r]=await pool.query(`INSERT INTO properties(title,description,price,location,property_type,purpose,bedrooms,bathrooms,area,image,owner_id,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
  [b.title,b.description,Number(b.price),b.location,b.property_type,b.purpose||'buy',Number(b.bedrooms||0),Number(b.bathrooms||0),Number(b.area||0),b.image||'',req.user.id,b.status||'active']);
  res.status(201).json({id:r.insertId,message:'Property added successfully.'});
 }catch(err){console.error(err);res.status(500).json({message:'Could not add property.'});}
});
router.put('/:id',auth,adminOnly,async(req,res)=>{
 try{const b=req.body;await pool.query(`UPDATE properties SET title=?,description=?,price=?,location=?,property_type=?,purpose=?,bedrooms=?,bathrooms=?,area=?,image=?,status=? WHERE id=?`,
 [b.title,b.description,Number(b.price),b.location,b.property_type,b.purpose,Number(b.bedrooms||0),Number(b.bathrooms||0),Number(b.area||0),b.image||'',b.status,req.params.id]);res.json({message:'Property updated.'});}
 catch{res.status(500).json({message:'Could not update property.'});}
});
router.delete('/:id',auth,adminOnly,async(req,res)=>{try{await pool.query('DELETE FROM properties WHERE id=?',[req.params.id]);res.json({message:'Property deleted.'});}catch{res.status(500).json({message:'Could not delete property.'});}});
export default router;
