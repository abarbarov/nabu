import { applyMiddleware, combineReducers, createStore } from 'redux';
import projects, { ProjectState } from './reducers/projects';
import { newGrpcMiddleware } from './middleware/grpc';

interface StoreEnhancerState {
}

export interface RootState extends StoreEnhancerState {
  projects: ProjectState;
}

const reducers = combineReducers<RootState>({
  projects,
});

export default createStore(
  reducers,
  applyMiddleware(
    newGrpcMiddleware(),
  )
);
