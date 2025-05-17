import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  addControl, 
  updateControl, 
  removeControl, 
  selectControl, 
  moveControl 
} from '../../
