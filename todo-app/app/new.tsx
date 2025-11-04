import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useRouter } from 'expo-router';

const Screen = styled.ScrollView`
  flex: 1;
  background-color: ${({theme}: {theme: DefaultTheme}) => theme.colors.bg};
  padding: 16px;
  gap: 12px;
`;
const Label = styled.Text` color: ${({theme}: {theme: DefaultTheme})=>theme.colors.sub}; font-weight: 600;`;
const Input = styled.TextInput`
  background-color: ${({theme}: {theme: DefaultTheme})=>theme.colors.card};
  color: ${({theme}: {theme: DefaultTheme})=>theme.colors.text};
  border: 1px solid ${({theme}: {theme: DefaultTheme})=>theme.colors.border};
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 10px;
`;
const Row = styled.View` flex-direction: row; gap: 10px;`;
const Btn = styled.Pressable`
  flex: 1; padding: 14px;
  background-color: ${({theme}: {theme: DefaultTheme})=>theme.colors.primary};
  border-radius: 12px; align-items: center;
`;
const BtnText = styled.Text` color: white; font-weight:700;`;

export default function New(){
  const router = useRouter();
  const create = useMutation(api.todos.create);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState('');

  const disabled = title.trim().length === 0;

  async function onSave(){
    try {
      await create({
        title,
        description: description || undefined,
        dueDate: due ? new Date(due).getTime() : undefined,
      });
      router.back();
    } catch {
      alert("Failed to create todo");
    }
  }

  return (
    <Screen>
      <Label>Title</Label>
      <Input placeholder="Pay rent" value={title} onChangeText={setTitle} />

      <Label>Description</Label>
      <Input placeholder="Optional details" value={description} onChangeText={setDescription} multiline />

      <Label>Due Date (YYYY-MM-DD)</Label>
      <Input placeholder="2025-11-30" value={due} onChangeText={setDue} />

      <Row>
        <Btn onPress={onSave} disabled={disabled}><BtnText>Save</BtnText></Btn>
      </Row>
    </Screen>
  );
}
