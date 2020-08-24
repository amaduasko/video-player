const player = document.querySelector('.player')
const video = document.querySelector('video')
const progressRange = document.querySelector('.progress-range')
const progressBar = document.querySelector('.progress-bar')
const playBtn = document.getElementById('play-btn')
const volumeIcon = document.getElementById('volume-icon')
const volumeRange = document.querySelector('.volume-range')
const volumeBar = document.querySelector('.volume-bar')
const currentTime = document.querySelector('.time-elapsed')
const duration = document.querySelector('.time-duration')
const speed = document.querySelector('.player-speed')
const fullScreenBtn = document.querySelector('.fullscreen')

const [isFullScreen, setIsFullScreen] = [
    { state: false },
    (state) => (isFullScreen.state = state),
]

const [lastVolume, setLastVolume] = [
    { state: 1 },
    (state) => (isPlaying.state = state),
]

// Play & Pause ----------------------------------- //
const showPlayIcon = () => {
    playBtn.classList.replace('fa-pause', 'fa-play')
    playBtn.setAttribute('title', 'Play')
}
const togglePlay = () => {
    if (video.paused) {
        video.play()
        playBtn.classList.replace('fa-play', 'fa-pause')
        playBtn.setAttribute('title', 'Pause')
    } else {
        video.pause()
        showPlayIcon()
    }
}

// Progress Bar ---------------------------------- //

const displayTime = (time) => {
    const minutes =
        Math.floor(time / 60) < 10
            ? `0${Math.floor(time / 60)}`
            : Math.floor(time / 60)
    const seconds =
        Math.floor(time % 60) < 10
            ? `0${Math.floor(time % 60)}`
            : Math.floor(time % 60)
    return `${minutes}:${seconds}`
}

const updateProgress = () => {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`
    currentTime.textContent = `${displayTime(video.currentTime)} /`
    duration.textContent = `${displayTime(video.duration)}`
}

const setProgress = (event) => {
    const { offsetX } = event
    const newTime = offsetX / progressRange.offsetWidth
    progressBar.style.width = `${newTime * 100}%`
    video.currentTime = newTime * video.duration
}

// Volume Controls --------------------------- //

const changeVolume = (event) => {
    const volume =
        event.offsetX / volumeRange.offsetWidth < 0.1
            ? 0
            : event.offsetX / volumeRange.offsetWidth > 0.9
            ? 1
            : event.offsetX / volumeRange.offsetWidth
    volumeBar.style.width = `${volume * 100}%`
    video.volume = volume

    volumeIcon.className =
        volume > 0.7
            ? 'fas fa-volume-up'
            : volume < 0.7 && volume > 0
            ? 'fas fa-volume-down'
            : volume === 0
            ? 'fas fa-volume-off'
            : volumeIcon.className

    setLastVolume(volume)
}

const toggleMute = () => {
    volumeIcon.className = ''
    if (video.volume) {
        setLastVolume(video.volume)
        video.volume = 0
        volumeBar.style.width = 0
        volumeIcon.classList.add('fas', 'fa-volume-mute')
        volumeIcon.setAttribute('title', 'Unmute')
    } else {
        video.volume = lastVolume.state
        volumeBar.style.width = `${lastVolume.state * 100}%`
        volumeIcon.classList.add('fas', 'fa-volume-up')
        volumeIcon.setAttribute('title', 'Mute')
    }
}

// Change Playback Speed -------------------- //

const changeSpeed = (event) => {
    video.playbackRate = speed.value
}

// Fullscreen ------------------------------- //
const toggleFullScreen = () => {
    !isFullScreen.state ? openFullscreen(player) : closeFullscreen()

    setIsFullScreen(!isFullScreen.state)
}
/* View in fullscreen */
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen()
    } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen()
    }
    video.classList.add('video-fullscreen')
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen()
    }
    video.classList.remove('video-fullscreen')
}

//Event Listeners

playBtn.addEventListener('click', togglePlay)
video.addEventListener('click', togglePlay)
video.addEventListener('ended', showPlayIcon)
video.addEventListener('timeupdate', updateProgress)
video.addEventListener('canplay', updateProgress)
progressRange.addEventListener('click', setProgress)
volumeRange.addEventListener('click', changeVolume)
volumeIcon.addEventListener('click', toggleMute)
speed.addEventListener('change', changeSpeed)
fullScreenBtn.addEventListener('click', toggleFullScreen)
