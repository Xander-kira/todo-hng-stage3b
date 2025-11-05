import React, { useMemo, useState, useContext } from 'react';
import { Link, useRouter } from 'expo-router';
import styled, { useTheme } from 'styled-components/native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ActivityIndicator, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TodoItem } from '../components/TodoItem';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from './_layout';

const Screen = styled.View` 
  flex:1; 
  background-color: ${({theme}: any)=>theme.colors.bg};
  align-items: center;
`;
const Container = styled.ScrollView`
  width: 100%;
  max-width: 540px;
  flex: 1;
`;
const HeroBar = styled.View` 
  height: 200px;
  width: 100%;
`;
const TopRow = styled.View`
  position: absolute; 
  top: 50px; 
  left: 0;
  right: 0;
  flex-direction: row; 
  justify-content: center;
  align-items: center;
`;
const TopRowInner = styled.View`
  width: 100%;
  max-width: 540px;
  padding: 0 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.Text` 
  color: white; 
  font-weight: 800; 
  font-size: 32px; 
  letter-spacing: 8px;
`;
const Content = styled.View` 
  padding: 20px; 
  gap: 16px; 
  margin-top: -40px;
  padding-bottom: 40px;
`;
const Row = styled.View` flex-direction: row; gap: 10px; align-items: center;`;
const Input = styled.TextInput`
  flex:1; 
  background-color: ${({theme}: any)=>theme.colors.card}; 
  color: ${({theme}: any)=>theme.colors.text};
  border: 1px solid ${({theme}: any)=>theme.colors.border}; 
  padding: 14px 18px; 
  border-radius: 12px;
  font-size: 15px;
`;
const Btn = styled(Link)` 
  padding: 14px 20px; 
  background-color: ${({theme}: any)=>theme.colors.primary}; 
  border-radius: 12px;
  align-items: center;
  justify-content: center;
` as any;
const BtnTxt = styled.Text` 
  color: white; 
  font-weight: 700;
  font-size: 15px;
`;
const Empty = styled.View` padding: 32px; align-items: center;`;
const EmptyTxt = styled.Text` color: ${({theme}: any)=>theme.colors.muted};`;
const Sep = styled.View` height: 10px;`;
const Touch = styled.Pressable``;

// Footer styles
const Footer = styled.View`
  background-color: ${({theme}: any)=>theme.colors.card};
  border: 1px solid ${({theme}: any)=>theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  gap: 12px;
`;
const FooterRow = styled.View` flex-direction: row; justify-content: space-between; align-items: center;`;
const ItemCount = styled.Text` color: ${({theme}: any)=>theme.colors.sub}; font-size: 14px;`;
const FilterRow = styled.View` flex-direction: row; gap: 8px; justify-content: center;`;
const FilterBtn = styled.Pressable<{active?: boolean}>`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${({theme, active}: any)=> active ? theme.colors.primary : 'transparent'};
  border: 1px solid ${({theme, active}: any)=> active ? theme.colors.primary : theme.colors.border};
`;
const FilterText = styled.Text<{active?: boolean}>`
  color: ${({theme, active}: any)=> active ? 'white' : theme.colors.text};
  font-weight: ${({active}: any)=> active ? '700' : '400'};
`;
const ClearBtn = styled.Pressable` padding: 8px 12px;`;
const ClearText = styled.Text` color: ${({theme}: any)=>theme.colors.sub}; text-decoration: underline;`;

type Filter = 'all' | 'active' | 'completed';

// Import images at top
const lightBg = require('../assets/light.png');
const darkBg = require('../assets/dark.png');

export default function Index(){
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);
  const router = useRouter();

  // realtime list
  const todos = useQuery(api.todos.list) ?? undefined; // undefined while loading
  const remove = useMutation(api.todos.remove);
  const toggle = useMutation(api.todos.toggle);
  const reorder = useMutation(api.todos.reorder);

  // search & filter
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const data = useMemo(()=>{
    if(!todos) return [] as any[];
    const n = q.trim().toLowerCase();
    let filtered = todos.filter(t =>
      !n || t.title.toLowerCase().includes(n) || t.description?.toLowerCase().includes(n)
    );
    
    // Apply filter
    if (filter === 'active') filtered = filtered.filter(t => !t.completed);
    if (filter === 'completed') filtered = filtered.filter(t => t.completed);
    
    return filtered;
  }, [todos, q, filter]);

  const activeCount = todos?.filter(t => !t.completed).length || 0;
  const completedCount = todos?.filter(t => t.completed).length || 0;

  const clearCompleted = () => {
    todos?.filter(t => t.completed).forEach(t => remove({ id: t._id }));
  };

  const renderItem = ({ item, drag }: RenderItemParams<any>) => (
    <Touch onLongPress={drag} delayLongPress={120}>
      <TodoItem
        item={item}
        onToggle={() => toggle({ id: item._id })}
        onDelete={() => remove({ id: item._id })}
        onEdit={() => router.push({ pathname: '/edit/[id]', params: { id: item._id } })}
      />
    </Touch>
  );

  return (
    <Screen>
      {/* Header with background image and gradient overlay - FULL WIDTH */}
      <HeroBar>
        <ImageBackground 
          source={mode === 'dark' ? darkBg : lightBg} 
          style={{ flex: 1 }} 
          resizeMode="cover"
        >
          <LinearGradient
            colors={theme.hero.gradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, opacity: 0.88 }}
          >
            <TopRow>
              <TopRowInner>
                <Title>TODO</Title>
                <ThemeToggle/>
              </TopRowInner>
            </TopRow>
          </LinearGradient>
        </ImageBackground>
      </HeroBar>

      {/* Content section - CENTERED */}
      <Container>
      <Content>
        {/* Search */}
        <Row>
          <Input
            placeholder="Search todos…"
            placeholderTextColor="#9AA3AF"
            value={q}
            onChangeText={setQ}
            accessibilityLabel="Search todos"
          />
        </Row>

        {/* New */}
        <Row>
          <Btn href="/new" asChild><BtnTxt>+ New</BtnTxt></Btn>
        </Row>

        {/* List */}
        {todos === undefined ? (
          <ActivityIndicator />
        ) : data.length === 0 ? (
          <Empty><EmptyTxt>No todos found. Total: {todos?.length || 0}</EmptyTxt></Empty>
        ) : (
          <DraggableFlatList
            data={data}
            keyExtractor={(item)=>item._id}
            onDragEnd={({ data: newData }) => reorder({ ids: newData.map((t:any)=>t._id) })}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Sep/>}
            scrollEnabled={false}
            style={{ minHeight: data.length * 100 }}
          />
        )}

        {/* Footer with filters */}
        {todos && todos.length > 0 && (
          <Footer>
            <FooterRow>
              <ItemCount>{activeCount} item{activeCount !== 1 ? 's' : ''} left</ItemCount>
              {completedCount > 0 && (
                <ClearBtn onPress={clearCompleted}>
                  <ClearText>Clear Completed</ClearText>
                </ClearBtn>
              )}
            </FooterRow>
            <FilterRow>
              <FilterBtn active={filter === 'all'} onPress={() => setFilter('all')}>
                <FilterText active={filter === 'all'}>All</FilterText>
              </FilterBtn>
              <FilterBtn active={filter === 'active'} onPress={() => setFilter('active')}>
                <FilterText active={filter === 'active'}>Active</FilterText>
              </FilterBtn>
              <FilterBtn active={filter === 'completed'} onPress={() => setFilter('completed')}>
                <FilterText active={filter === 'completed'}>Completed</FilterText>
              </FilterBtn>
            </FilterRow>
            <FooterRow style={{justifyContent: 'center', marginTop: 8}}>
              <ItemCount style={{textAlign: 'center'}}>Drag and drop to reorder list</ItemCount>
            </FooterRow>
          </Footer>
        )}
      </Content>
      </Container>
    </Screen>
  );
}
