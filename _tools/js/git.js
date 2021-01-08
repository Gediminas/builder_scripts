let _path  = require('path');
let _fs    = require('fs');
let _child = require('child_process');

exports.getclean_repo = (repo, dir, branch) => {
  const git_check_path = _path.resolve(dir + '/.git/refs/heads');

  console.log('Git branch ['+branch+']');

  let opts = {
    stdio: 'inherit'
  };

  if (_fs.existsSync(git_check_path)) {
    opts.cwd = dir;

    console.log('Cleaning git repository (git fetch --all)');
    _child.execFileSync("git", ["fetch", "--all"], opts);

    console.log('@sub cleanup...');
        console.log('Cleaning git repository (git reset --hard origin/master)');
        _child.execFileSync("git", ["reset", "--hard", "origin/"+branch], opts);

        console.log('Cleaning git repository (git clean -f -d)');
        _child.execFileSync("git", ["clean", "-fdx"], opts);
     console.log('@end');

    console.log('Updating repo (git pull)');
    _child.execFileSync("git", ["pull"], opts);
  }
  else {
    console.log('Cloning git repository ['+repo+'] to ['+dir+']');
    try {
    _child.execFileSync("git", ["clone", "--progress", "--recursive", "-b", branch, repo, dir], opts);
    }
    catch (e) {
        console.log("EXCEPTION `FROM SCRIPT: ", e);
      return false;
    }
  }
  return true;
}

exports.getclean = (repo, dir, branch) => {
  console.log(`@sub GetClean(${repo}, ${dir}, ${branch})`);

  dir    = _path.resolve(dir);
  branch = (branch == undefined) ? 'master' : branch;
  let ret = exports.getclean_repo(repo, dir, branch);

  /*
  try {
    let submodules = JSON.parse(_fs.readFileSync(dir+'/.submodules', 'utf8'));
    submodules.forEach(function(submodule) {
      //exports.getclean_repo(submodule[0], dir+'/'+submodule[1], branch);
    });
  }
  catch (e) {
    if (e.code != 'ENOENT') {
      console.log(e);
    }
  }
  */
  console.log('@end');
  return ret;
}
