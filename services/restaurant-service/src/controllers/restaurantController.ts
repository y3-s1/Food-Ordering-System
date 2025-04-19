import { Request, Response } from 'express';
import Restaurant from '../models/restaurantModel';
import MenuItem from '../models/menuItemModel';

export const addMenuItem = async (req: Request, res: Response) => {
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.status(201).json(newItem);
};

export const updateMenuItem = async (req: Request, res: Response) => {
  const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

export const setRestaurantAvailability = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const { isAvailable } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, { isAvailable }, { new: true });
  res.json(restaurant);
};

export const getRestaurantMenu = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const items = await MenuItem.find({ restaurantId });
  res.json(items);
};
