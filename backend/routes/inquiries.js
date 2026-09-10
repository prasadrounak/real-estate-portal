import express from 'express';
import pool from '../config/db.js';
import {auth,adminOnly} from '../middleware/auth.js';
const router=express.Router();
router.post('/',async(req,res)=>{try{const b=req.body;if(!b.property_id||!b.name||!b.email||!b.message)return res.status(400).json({message:'Property, name, email and message are required.'});const[r]=await pool.query('INSERT INTO inquiries(user_id,property_id,name,email,phone,message) VALUES(?,?,?,?,?,?)',[b.user_id||null,b.property_id,b.name,b.email,b.phone||'',b.message]);res.status(201).json({id:r.insertId,message:'Inquiry sent successfully.'});}catch{res.status(500).json({message:'Could not send inquiry.'});}});
router.get('/',auth,async(req,res)=>{try{let sql='SELECT i.*,p.title property_title FROM inquiries i JOIN properties p ON i.property_id=p.id',a=[];if(req.user.role!=='admin'){sql+=' WHERE i.user_id=?';a=[req.user.id];}sql+=' ORDER BY i.created_at DESC';const[r]=await pool.query(sql,a);res.json(r);}catch{res.status(500).json({message:'Could not load inquiries.'});}});
router.put('/:id',auth,adminOnly,async(req,res)=>{if(!['new','contacted','closed'].includes(req.body.status))return res.status(400).json({message:'Invalid status.'});await pool.query('UPDATE inquiries SET status=? WHERE id=?',[req.body.status,req.params.id]);res.json({message:'Inquiry updated.'});});
export default router;
