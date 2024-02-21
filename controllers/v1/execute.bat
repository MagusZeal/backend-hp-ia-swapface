@echo off
    cd /d C:\windows\TempCache\roop\venv\Scripts
    call activate
    cd /d C:\windows\TempCache\roop
    python run.py --keep-frames --keep-fps --temp-frame-quality 100 --output-video-quality 30 --execution-provider cuda --frame-processor face_swapper face_enhancer  -s "C:\swapface_files\image\woman1.jpg" -t "C:\swapface_files\target\VIDEO6.mp4" -o "C:\swapface_files\output\569_22222222.mp4"