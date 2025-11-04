import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styled, { DefaultTheme } from 'styled-components/native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

const Screen = styled.ScrollView`
  flex:1; background-color: ${({theme}: {theme: DefaultTheme})=>theme.colors.bg};
  padding: 16px; gap: 12px;
`;
const Label = styled.Text` color: ${({theme}: {theme: DefaultTheme})=>theme.colors.sub}; font-weight:600;`;
const Input = styled.TextInput`
  background-color: ${({theme}: {theme: DefaultTheme})=>theme.colors.card};
  color: ${({theme}: {theme: DefaultTheme})=>theme.colors.text};
  border: 1px solid ${({theme}: {theme: DefaultTheme})=>theme.colors.border};
  padding: 12px 14px; border-radius: 12px; margin-bottom: 10px;
`;

const Row = styled.View` flex-direction: row; gap: 10px;`;
const Btn = styled.Pressable`
  flex:1; padding:14px;
  background-color: ${({theme}: {theme: DefaultTheme})=>theme.colors.primary};
  border-radius:12px; align-items:center;
`;
const BtnDanger = styled(Btn)` background-color: ${({theme}: {theme: DefaultTheme})=>theme.colors.danger};`;
const BtnText = styled.Text` color:white; font-weight:700;`;

export default function Edit(){
  const router = useRouter();
  const { id } = useLocalSearchParams<{id:string}>();

  const todo = useQuery(api.todos.get, id ? { id: id as Id<"todos"> } : "skip");
  const update = useMutation(api.todos.update);
  const remove = useMutation(api.todos.remove);

  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [due,setDue] = useState('');

  useEffect(()=>{
    if(todo){
      setTitle(todo.title);
      setDescription(todo.description ?? '');
      setDue(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0,10) : '')
    }
  }, [todo]);

  if(!todo) return <Screen />

  async function onSave(){
    if (!todo) return;
    await update({
      id: todo._id,
      patch: {
        title,
        description: description || undefined,
        dueDate: due ? new Date(due).getTime() : undefined
      }
    });
    router.back();
  }

  async function onDelete(){
    if (!todo) return;
    await remove({ id: todo._id });
    router.replace('/');
  }

  return (
    <Screen>
      <Label>Title</Label>
      <Input value={title} onChangeText={setTitle}/>

      <Label>Description</Label>
      <Input value={description} onChangeText={setDescription} multiline/>

      <Label>Due (YYYY-MM-DD)</Label>
      <Input value={due} onChangeText={setDue}/>

      <Row>
        <Btn onPress={onSave}><BtnText>Save</BtnText></Btn>
        <BtnDanger onPress={onDelete}><BtnText>Delete</BtnText></BtnDanger>
      </Row>
    </Screen>
  );
}
