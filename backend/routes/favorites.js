import express from 'express';
import pool from '../config/db.js';
import {auth} from '../middleware/auth.js';
const router=express.Router();
router.get('/',auth,async(req,res)=>{const[r]=await pool.query(`SELECT p.* FROM favorites f JOIN properties p ON f.property_id=p.id WHERE f.user_id=? ORDER BY f.created_at DESC`,[req.user.id]);res.json(r);});
router.get('/ids',auth,async(req,res)=>{const[r]=await pool.query('SELECT property_id FROM favorites WHERE user_id=?',[req.user.id]);res.json(r.map(x=>x.property_id));});
router.post('/:id',auth,async(req,res)=>{try{await pool.query('INSERT INTO favorites(user_id,property_id) VALUES(?,?)',[req.user.id,req.params.id]);res.status(201).json({message:'Added to favorites.'});}catch(e){if(e.code==='ER_DUP_ENTRY')return res.json({message:'Already in favorites.'});res.status(500).json({message:'Could not add favorite.'});}});
router.delete('/:id',auth,async(req,res)=>{await pool.query('DELETE FROM favorites WHERE user_id=? AND property_id=?',[req.user.id,req.params.id]);res.json({message:'Removed from favorites.'});});
export default router;
