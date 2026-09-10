import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import {auth} from '../middleware/auth.js';
const router=express.Router();
router.post('/register',async(req,res)=>{
 try{
  const name=String(req.body.name||'').trim(),email=String(req.body.email||'').trim().toLowerCase(),
  phone=String(req.body.phone||'').trim(),password=String(req.body.password||'');
  if(!name||!email||!password)return res.status(400).json({message:'Name, email and password are required.'});
  if(password.length<6)return res.status(400).json({message:'Password must contain at least 6 characters.'});
  const [e]=await pool.query('SELECT id FROM users WHERE email=?',[email]);
  if(e.length)return res.status(409).json({message:'This email is already registered.'});
  const hash=await bcrypt.hash(password,10);
  const [r]=await pool.query('INSERT INTO users(name,email,phone,password,role) VALUES(?,?,?,?,?)',[name,email,phone,hash,'user']);
  const [u]=await pool.query('SELECT id,name,email,phone,role FROM users WHERE id=?',[r.insertId]);
  res.status(201).json({message:'Registration successful. You can now login.',user:u[0]});
 }catch(err){console.error(err);res.status(500).json({message:'Registration failed. Check MySQL and backend configuration.'});}
});
router.post('/login',async(req,res)=>{
 try{
  const email=String(req.body.email||'').trim().toLowerCase(),password=String(req.body.password||'');
  const [rows]=await pool.query('SELECT * FROM users WHERE email=?',[email]);
  if(!rows.length||!(await bcrypt.compare(password,rows[0].password)))return res.status(401).json({message:'Invalid email or password.'});
  const u=rows[0],token=jwt.sign({id:u.id,name:u.name,email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:'7d'});
  res.json({token,user:{id:u.id,name:u.name,email:u.email,phone:u.phone,role:u.role}});
 }catch(err){console.error(err);res.status(500).json({message:'Login failed. Check MySQL and backend.'});}
});
router.get('/me',auth,async(req,res)=>{
 const [u]=await pool.query('SELECT id,name,email,phone,role FROM users WHERE id=?',[req.user.id]);
 if(!u.length)return res.status(404).json({message:'User not found.'});res.json({user:u[0]});
});
export default router;
