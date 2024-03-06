@setup
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $commit_short_sha = env('CI_COMMIT_SHORT_SHA', NULL);

    $app_dir = env('CICD_APP_DIR', NULL);
    $tmp_dir = $app_dir  .'/tmp/';
    
    $dist_zip_file = $tmp_dir . $commit_short_sha . '.zip';
    $dist_path = $tmp_dir . 'dist/';

    $releases_dir = $app_dir  .'/releases';

    $now = time();
    $new_release_dir_name = date('Ymd', $now) . '_' . $commit_short_sha;
    $new_release_dir = $releases_dir .'/'. $new_release_dir_name;

    $day_delete = 7;
    $day_delete_after = $day_delete + 1;
    $max_dir_date = date('Ymd', strtotime("-{$day_delete_after} days"));

    $host = env('CICD_HOST', NULL);
    $user_name = env('CICD_USERNAME', NULL);

    $app_env = env('CICD_APP_ENV', NULL);
    $telegram_token = env('CICD_TELEGRAM_TOKEN', NULL);
    $telegram_chat_id = env('CICD_TELEGRAM_CHAT_ID', NULL);
@endsetup

@servers(['web' => $user_name . '@' . $host])

@story('deploy')
    extract_dist_zip
    update_symlinks
    clear_old_source
@endstory

@task('extract_dist_zip')
    echo "Starting deployment {{ $short }}"

    echo "Extract dist from {{ $dist_zip_file }}"
    [ -d {{ $releases_dir }} ] || mkdir {{ $releases_dir }}
    unzip {{ $dist_zip_file }} -d {{ $tmp_dir }}
    mv {{ $dist_path }} {{ $new_release_dir }}

    echo "Remove source zip"
    rm -rf {{ $tmp_dir }}
@endtask

@task('update_symlinks')
    echo "Linking current release"
    ln -nfs {{ $new_release_dir }} {{ $app_dir }}/current
@endtask

@task('clear_old_source')
    echo "Clear old source in {{ $releases_dir }}"

    max_dir_date=$((({{ $max_dir_date }})))
    for dir_name in $(ls {{ $releases_dir }})
    do
        if [[ $dir_name =~ ^([0-9]{8})_.*$ ]]
        then
            dir_date="${BASH_REMATCH[1]}"
            dir_date=$(($dir_date))
        
            if [[ $dir_date -gt $max_dir_date ]]
            then
                continue
            fi
            
            delete_path="{{ $releases_dir }}/$dir_name"
            echo "Remove dir $delete_path"
            $(rm -rf $delete_path)
        fi
    done
@endtask

@error
    @telegram($telegram_token, $telegram_chat_id, '[APP Guru Booking] [' . $commit_short_sha . '] gặp lỗi ở bước ' . $task . ' tại môi trường [' . $app_env . ']. Xách dép chạy ngay đi.')
@enderror

@success
    @telegram($telegram_token, $telegram_chat_id, '[APP Guru Booking] [' . $commit_short_sha . '] đã triển khai lên môi trường [' . $app_env . ']')
@endsuccess
