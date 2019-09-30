/*
Copyright 2019 The Tekton Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import { waitForElement } from 'react-testing-library';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import PipelineRun from './PipelineRun';
import { renderWithIntl } from '../../utils/test';

it('PipelineRunContainer renders', async () => {
  const pipelineRunName = 'bar';
  const match = {
    params: {
      pipelineName: 'foo',
      pipelineRunName
    }
  };
  const middleware = [thunk];
  const mockStore = configureStore(middleware);
  const testStore = mockStore({
    tasks: {
      byNamespace: { default: {} }
    },
    namespaces: {
      selected: 'default'
    },
    pipelineRuns: {
      byId: {},
      byNamespace: { default: {} },
      errorMessage: null,
      isFetching: false
    }
  });

  const { getByText } = renderWithIntl(
    <Provider store={testStore}>
      <PipelineRun
        match={match}
        fetchTaskRuns={() => Promise.resolve()}
        fetchPipelineRun={() => Promise.resolve()}
        fetchTasks={() => Promise.resolve()}
        fetchClusterTasks={() => Promise.resolve()}
        error={null}
        loading={false}
      />
    </Provider>
  );
  await waitForElement(() => getByText('PipelineRun not found'));
});

it('PipelineRunContainer handles error state', async () => {
  const match = {
    params: {
      pipelineName: 'foo',
      pipelineRunName: 'bar'
    }
  };

  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  const testStore = mockStore({
    tasks: {
      byNamespace: { default: {} }
    },
    taskRuns: {
      byId: {},
      byNamespace: { default: {} },
      errorMessage: null,
      isFetching: false
    },
    namespaces: {
      selected: 'default'
    },
    pipelineRuns: {
      byId: {},
      byNamespace: { default: {} },
      errorMessage: 'Error',
      isFetching: false
    }
  });

  const { getByText } = renderWithIntl(
    <Provider store={testStore}>
      <PipelineRun
        match={match}
        error="Error"
        fetchTaskRuns={() => Promise.resolve()}
        fetchPipelineRun={() => Promise.resolve()}
        fetchTasks={() => Promise.resolve()}
        fetchClusterTasks={() => Promise.resolve()}
      />
    </Provider>
  );
  await waitForElement(() => getByText('Error loading PipelineRun'));
});

// A scenario exists (typically with rebuild) where all PipelineRun data
// is not yet available. Verify that the container still renders OK
it('PipelineRunContainer handles no TaskRuns found yet', async () => {
  const match = {
    params: {
      pipelineName: 'foo',
      pipelineRunName: 'bar'
    }
  };

  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  const testStore = mockStore({
    tasks: {
      byNamespace: {}
    },
    taskRuns: {
      // Nothing here
      byId: {},
      byNamespace: {},
      errorMessage: null,
      isFetching: false
    },
    namespaces: {
      selected: 'default'
    },
    pipelineRuns: {
      byId: {},
      byNamespace: { default: {} },
      errorMessage: null,
      isFetching: false
    }
  });

  const { getByText } = renderWithIntl(
    <Provider store={testStore}>
      <PipelineRun
        match={match}
        error={null}
        fetchTaskRuns={() => Promise.resolve()}
        fetchPipelineRun={() => Promise.resolve()}
        fetchTasks={() => Promise.resolve()}
        fetchClusterTasks={() => Promise.resolve()}
      />
    </Provider>
  );
  // But it still renders and all is well
  await waitForElement(() => getByText('PipelineRun not found'));
});
