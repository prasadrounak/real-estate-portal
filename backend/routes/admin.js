import express from 'express';
import pool from '../config/db.js';
import {auth,adminOnly} from '../middleware/auth.js';
const router=express.Router();router.use(auth,adminOnly);
router.get('/stats',async(req,res)=>{const[[users]]=await pool.query('SELECT COUNT(*) count FROM users');const[[properties]]=await pool.query('SELECT COUNT(*) count FROM properties');const[[active]]=await pool.query("SELECT COUNT(*) count FROM properties WHERE status='active'");const[[inquiries]]=await pool.query('SELECT COUNT(*) count FROM inquiries');res.json({users:users.count,properties:properties.count,active:active.count,inquiries:inquiries.count});});
router.get('/users',async(req,res)=>{const[r]=await pool.query('SELECT id,name,email,phone,role,created_at FROM users ORDER BY id DESC');res.json(r);});
export default router;
