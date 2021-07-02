(() => {
  /**
   * Selectors
   */
  $exerciseAdd = document.getElementById('ExerciseAdd')
  $userAdd = document.getElementById('UserAdd')
  $userSelector = document.getElementById('UserSelector')
  $workoutTable = document.getElementById('WorkoutTable')

  /**
   * Globals
   */
  const EXERCISES_KEY = 'workout.logger.logs'
  const SELECTED_USER_KEY = 'workout.logger.user'

  let storage = {}
  let selectedUser = ''

  /**
   * Helpers
   */
  function loadData() {
    const loadedStorage = localStorage.getItem(EXERCISES_KEY)
    const loadedUser = localStorage.getItem(SELECTED_USER_KEY) || ''

    if (loadedStorage) {
      return [JSON.parse(loadedStorage), loadedUser]
    }

    return [{}, loadedUser]
  }

  function reset(element) {
    Array.from(element.children).forEach((child) => {
      if (!child.dataset.keep) {
        child.remove()
      }
    })
  }

  function saveData() {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(storage))
    localStorage.setItem(SELECTED_USER_KEY, selectedUser)
  }

  /**
   * Event Handlers
   */
  function onDeleteExercise(event) {
    const index = parseInt(event.target.dataset.index)

    storage[selectedUser].splice(index, 1)

    render()
    saveData()
  }

  function onExerciseAdd(event) {
    if (!selectedUser) {
      return alert('Please select an athlete first.')
    }

    const exercise = prompt('Please enter an exercise.')

    if (!exercise) {
      return
    }

    const weight = prompt('Please enter the weight.')

    if (!weight) {
      return
    }

    const reps = prompt('Please enter the number of reps.')

    if (!reps) {
      return
    }

    storage[selectedUser].push({
      exercise: exercise,
      reps: reps,
      weight: weight,
    })

    render()
    saveData()
  }

  function onUserAdd(event) {
    const name = prompt('Please enter a name.')

    if (!name) {
      return
    }

    if (storage[name]) {
      return alert('There\'s already an athlete with this name.')
    }

    storage[name] = []

    render()
    saveData()
  }

  function onUserSelected(event) {
    selectedUser = event.target.value

    render()
    saveData()
  }

  /**
   * Renderers
   */
  function renderUserSelector() {
    reset($userSelector)

    const users = Object.keys(storage)

    users.forEach((user) => {
      const node = document.createElement('option')
      const text = document.createTextNode(user)

      node.appendChild(text)
      node.setAttribute('value', user)

      $userSelector.appendChild(node)
    })

    if (selectedUser) {
      $userSelector.value = selectedUser
    }
  }

  function renderWorkoutTable(exercises = []) {
    reset($workoutTable)

    if (selectedUser) {
      const records = storage[selectedUser]

      records.forEach((record, index) => {
        const deleteButton = document.createElement('button')
        const deleteButtonText = document.createTextNode('Remove')
        const exercise = document.createElement('td')
        const exerciseText = document.createTextNode(record.exercise)
        const row = document.createElement('tr')
        const weightReps = document.createElement('td')
        const weightRepsText = document.createTextNode(`${record.weight}x${record.reps}`)

        deleteButton.appendChild(deleteButtonText)
        exercise.appendChild(exerciseText)
        weightReps.appendChild(weightRepsText)

        row.appendChild(exercise)

        row.appendChild(weightReps)

        row.appendChild(deleteButton)

        $workoutTable.appendChild(row)

        deleteButton.setAttribute('data-index', index)
        row.setAttribute('data-index', index)

        deleteButton.addEventListener('click', onDeleteExercise)
      })
    }
  }

  function render() {
    renderWorkoutTable()
    renderUserSelector()
  }

  /**
   * Initialize
   */
  (function init() {
    $exerciseAdd.addEventListener('click', onExerciseAdd)
    $userAdd.addEventListener('click', onUserAdd)
    $userSelector.addEventListener('change', onUserSelected)

    const [loadedStorage, loadedUser] = loadData()

    storage = loadedStorage
    selectedUser = loadedUser

    render()
  })()
})()
