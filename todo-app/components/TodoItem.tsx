import React from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Id } from '../convex/_generated/dataModel';

export type Todo = {
  _id: Id<"todos">; title: string; description?: string; dueDate?: number;
  completed: boolean; order: number; createdAt: number;
};

const Card = styled.View`
  background-color: ${({theme}: {theme: DefaultTheme})=>theme.colors.card};
  border: 1px solid ${({theme}: {theme: DefaultTheme})=>theme.colors.border};
  padding: 16px;
  border-radius: ${({theme}: {theme: DefaultTheme})=>`${theme.shapes.radius}px`};
  gap: 8px;
`;
const Row = styled.View` flex-direction: row; align-items: center; gap: 12px;`;
const CheckBox = styled.Pressable`
  width: 24px;
  height: 24px;
  border-radius: 50px;
  border: 2px solid ${({theme}: {theme: DefaultTheme})=>theme.colors.border};
  align-items: center;
  justify-content: center;
`;
const TextArea = styled.View` flex: 1; gap: 4px;`;
const Title = styled.Text<{completed?: boolean}>`
  color: ${({theme, completed}: any)=>completed ? theme.colors.muted : theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  text-decoration-line: ${({completed}: any)=>completed ? 'line-through' : 'none'};
`;
const Sub = styled.Text` color: ${({theme}: {theme: DefaultTheme})=>theme.colors.sub}; font-size: 14px;`;
const Actions = styled.View` flex-direction: row; gap: 12px;`;

export function TodoItem({ item, onToggle, onDelete, onEdit }:{
  item: Todo; onToggle:()=>void; onDelete:()=>void; onEdit:()=>void;
}){
  const due = item.dueDate ? new Date(item.dueDate).toDateString() : undefined;
  return (
    <Card accessible accessibilityLabel={`Todo ${item.title}`}>
      <Row>
        <CheckBox onPress={onToggle} accessibilityLabel="Toggle complete">
          <Ionicons 
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'} 
            size={24}
            color={item.completed ? '#22C55E' : '#9CA3AF'}
          />
        </CheckBox>
        <TextArea>
          <Title completed={item.completed}>{item.title}</Title>
          {item.description ? <Sub>{item.description}</Sub> : null}
          {due ? <Sub>📅 {due}</Sub> : null}
        </TextArea>
        <Actions>
          <Pressable onPress={onEdit} accessibilityLabel="Edit todo">
            <Ionicons name="create-outline" size={20} color="#6B7280"/>
          </Pressable>
          <Pressable onPress={onDelete} accessibilityLabel="Delete todo">
            <Ionicons name="trash-outline" size={20} color="#EF4444"/>
          </Pressable>
        </Actions>
      </Row>
    </Card>
  );
}
